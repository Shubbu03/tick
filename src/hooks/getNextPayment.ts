import { PlanType } from "@/lib/enums";
import { Subscription } from "@/lib/interfaces";

const getNextPayment = (subscriptions: Subscription[]) => {
  const today = new Date();

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  if (activeSubscriptions.length === 0) {
    return { amount: 0, date: null };
  }

  const upcomingPayments = activeSubscriptions.map((sub) => {
    const dueDate = new Date(sub.dueDate);
    if (!sub.autoRenew) {
      return {
        amount: sub.price,
        date: dueDate,
      };
    }

    let nextPaymentDate = new Date(sub.dueDate);

    while (nextPaymentDate < today) {
      switch (sub.planDuration) {
        case PlanType.Monthly:
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          break;
        case PlanType.Quarterly:
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
          break;
        case PlanType.Half_Yearly:
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 6);
          break;
        case PlanType.Yearly:
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 12);
          break;
      }
    }

    return {
      amount: sub.price,
      date: nextPaymentDate,
    };
  });

  const nextPayment = upcomingPayments.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )[0];

  return nextPayment;
};

export default getNextPayment;
