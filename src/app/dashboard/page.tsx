"use client";

import { useEffect, useState } from "react";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import StatsCard from "@/components/StatsCard";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "react-day-picker";
import SubscriptionCard from "@/components/SubscriptionCard";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { Label } from "@radix-ui/react-label";
import { SubscriptionCardProps } from "@/lib/interfaces";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const [montlyExpense, setMontlyExpense] = useState(0);
  const [userSubscription, setUserSubscription] = useState([]);
  const [totalSubscription, setTotalSubscription] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMonthlyExpense();
    fetchUserSubscription();
  }, []);

  const fetchMonthlyExpense = async () => {
    try {
      const response = await axios.get("/api/get-monthly-expense");
      if (response) {
        setMontlyExpense(response.data.data);
      }
    } catch (err) {
      console.error("Error occured while loading user's montly expense:", err);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const response = await axios.get("/api/get-subscription");
      if (response && response.status == 200) {
        setUserSubscription(response.data.subscription);
        setTotalSubscription(response.data.subscription.length);
      }
    } catch (err) {
      console.error("Error occured while loading user's subscription", err);
    }
  };

  const getMonthlySubscriptionPrice = (price: number, category: string) => {
    const divisors = {
      Yearly: 12,
      Half_Yearly: 6,
      Quarterly: 3,
    };
    const fixedValue =
      price / (divisors[category as keyof typeof divisors] || 1);
    return fixedValue.toFixed(2);
  };

  const handleAddSubscription = async (formData: any) => {
    try {
      const response = await axios.post("/api/add-subscription", formData);
      if (response.status === 200) {
        // Refresh subscriptions and monthly expense
        fetchUserSubscription();
        fetchMonthlyExpense();
      }
    } catch (err) {
      console.error("Error adding subscription:", err);
    }
  };

  return (
    <div>
      <div className="flex w-full p-4 gap-4">
        <StatsCard
          title="Monthly Expense"
          amount={montlyExpense}
          isMoney={true}
        />
        <StatsCard
          title="Active Subscription"
          amount={totalSubscription}
          isMoney={false}
        />
        <StatsCard title="Next Payment" amount={29.99} isMoney={true} />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recent Subscriptions
        </h2>
      </div>
      {userSubscription.map((subs: SubscriptionCardProps) => (
        <SubscriptionCard
          key={subs.name}
          name={subs.name}
          category={subs.category}
          price={getMonthlySubscriptionPrice(subs.price, subs.planDuration)}
          isActive={subs.isActive}
          autoRenew={subs.autoRenew}
          planDuration={subs.planDuration}
        />
      ))}

      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <AddSubscriptionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddSubscription}
      />
    </div>
  );
}
