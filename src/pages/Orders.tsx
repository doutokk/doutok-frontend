import { useEffect, useState } from "react";
import { List, Card, Typography, Space, Empty, Image, Button } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import http from "../utils/http";

const { Title, Text } = Typography;

interface OrderItem {
  item: {
    productId: number;
    productName: string;
    price: number;
    description: string;
    img: string;
    quantity: number;
  };
  cost: number;
}

interface Address {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: number;
}

interface Order {
  orderId: string;
  userId: number;
  userCurrency: string;
  orderItems: OrderItem[];
  address: Address;
  email: string;
  createdAt: number;
}

type PaymentStatus = "Uncreated" | "PAYING" | "FINISH";

interface PaymentStatusResponse {
  status: PaymentStatus;
}

interface CreatePaymentResponse {
  paymentUrl: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, PaymentStatus>
  >({});
  const [paymentLoading, setPaymentLoading] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await http.get("/order");
        setOrders(response.data.orders);
      } catch (error) {
        console.error("获取订单列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      const statuses: Record<string, PaymentStatus> = {};
      for (const order of orders) {
        try {
          const response = await http.post(`/payment/${order.orderId}/status`);
          statuses[order.orderId] = response.data.status;
        } catch (error) {
          console.error(`获取订单 ${order.orderId} 支付状态失败:`, error);
        }
      }
      setPaymentStatuses(statuses);
    };

    if (orders.length > 0) {
      fetchPaymentStatuses();
    }
  }, [orders]);

  const handleCreatePayment = async (orderId: string) => {
    setPaymentLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const response = await http.post("/payment", { order_id: orderId });
      const data = response.data as CreatePaymentResponse;
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("创建支付失败:", error);
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleCancelPayment = async (orderId: string) => {
    setPaymentLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await http.post(`/payment/${orderId}/cancel`);
      setPaymentStatuses((prev) => ({ ...prev, [orderId]: "Uncreated" }));
    } catch (error) {
      console.error("取消支付失败:", error);
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Calculate the total order amount
  const calculateOrderTotal = (order: Order): number => {
    return order.orderItems.reduce((total, item) => total + item.cost, 0);
  };

  return (
    <div className="py-6 px-4 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingOutlined className="text-xl" />
        <h2 className="text-2xl font-bold m-0">我的订单</h2>
      </div>

      {orders.length === 0 && !loading ? (
        <Empty description="暂无订单" />
      ) : (
        <List
          loading={loading}
          dataSource={orders}
          renderItem={(order) => (
            <List.Item className="w-full">
              <Card
                title={
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4">
                      <Text>订单号: {order.orderId}</Text>
                      <Text>货币: {order.userCurrency}</Text>
                      {order.createdAt > 0 && (
                        <Text>
                          下单时间: {new Date(order.createdAt).toLocaleString()}
                        </Text>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {paymentStatuses[order.orderId] === "Uncreated" && (
                        <Button
                          type="primary"
                          loading={paymentLoading[order.orderId]}
                          onClick={() => handleCreatePayment(order.orderId)}
                        >
                          支付
                        </Button>
                      )}
                      {paymentStatuses[order.orderId] === "PAYING" && (
                        <Button
                          danger
                          loading={paymentLoading[order.orderId]}
                          onClick={() => handleCancelPayment(order.orderId)}
                        >
                          取消支付
                        </Button>
                      )}
                      {paymentStatuses[order.orderId] === "FINISH" && (
                        <Text type="success">订单已完成</Text>
                      )}
                    </div>
                  </div>
                }
                className="w-full"
              >
                <List
                  dataSource={order.orderItems}
                  renderItem={(orderItem) => (
                    <List.Item>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <div className="w-24">
                          <Image
                            src={orderItem.item.img}
                            alt={orderItem.item.productName}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                          />
                        </div>
                        <div className="flex-1">
                          <Title level={5}>{orderItem.item.productName}</Title>
                          <Text type="secondary" ellipsis={{ rows: 2 }}>
                            {orderItem.item.description}
                          </Text>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <Text>
                              单价: {orderItem.item.price} {order.userCurrency}
                            </Text>
                            <Text>数量: {orderItem.item.quantity}</Text>
                            <Text strong>
                              总价: {orderItem.cost} {order.userCurrency}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                <div className="mt-4 space-y-2">
                  <Text strong className="block">
                    收货地址:
                  </Text>
                  <div className="text-gray-600">
                    <p className="m-0">{order.address.streetAddress}</p>
                    <p className="m-0">{`${order.address.city}, ${order.address.state}`}</p>
                    <p className="m-0">{`${order.address.country} ${order.address.zipCode}`}</p>
                    <p className="m-0">邮箱: {order.email}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-end">
                    <Text strong className="text-lg">
                      订单总金额: {calculateOrderTotal(order)}{" "}
                      {order.userCurrency}
                    </Text>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Orders;
