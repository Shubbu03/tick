import { PlanType } from "@/lib/enums";
import { Subscription } from "@/lib/interfaces";

// Utility function to calculate next payment date and amount
const getNextPayment = (subscriptions: Subscription[]) => {
  const today = new Date();

  // Filter active subscriptions
  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  if (activeSubscriptions.length === 0) {
    return { amount: 0, date: null };
  }

  // Get next payment for each subscription
  const upcomingPayments = activeSubscriptions.map((sub) => {
    // If subscription is not set to auto-renew, use the dueDate
    if (!sub.autoRenew) {
      return {
        amount: sub.price,
        date: sub.dueDate,
      };
    }

    // For auto-renewing subscriptions, calculate next payment date
    let nextPaymentDate = new Date(sub.dueDate);

    // If the due date has passed, calculate the next payment date
    while (nextPaymentDate < today) {
      // Add months based on plan duration
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

  // Sort by date and get the closest upcoming payment
  const nextPayment = upcomingPayments.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )[0];

  return nextPayment;
};

export default getNextPayment;
