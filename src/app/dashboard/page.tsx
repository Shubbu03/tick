"use client";

import { useEffect, useState } from "react";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import StatsCard from "@/components/StatsCard";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "@/components/SubscriptionCard";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { Label } from "@radix-ui/react-label";
import { SubscriptionCardProps } from "@/lib/interfaces";
import { Plus } from "lucide-react";
import getNextPayment from "@/hooks/getNextPayment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [montlyExpense, setMontlyExpense] = useState(0);
  const [userSubscription, setUserSubscription] = useState([]);
  const [totalSubscription, setTotalSubscription] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const nextPayment = getNextPayment(userSubscription);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setLoading(false);
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    await Promise.all([fetchMonthlyExpense(), fetchUserSubscription()]);
    setLoading(false);
  };

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

  const handleAddSubscription = async (data: any) => {
    try {
      const response = await axios.post("/api/add-subscription", data);
      if (response.status === 200) {
        console.log("Subscription added successfully!");
      }
      await fetchUserSubscription();
      await fetchMonthlyExpense();
    } catch (err) {
      console.error("Error adding subscription:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {totalSubscription > 0 ? (
        <>
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
            <StatsCard
              title="Next Payment"
              amount={nextPayment.amount}
              date={nextPayment.date}
              isMoney={true}
            />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Recent Subscriptions
            </h2>
          </div>
          <div className="flex-1">
            {userSubscription.map((subs: SubscriptionCardProps) => (
              <SubscriptionCard
                key={subs.name}
                name={subs.name}
                category={subs.category}
                price={Number(
                  getMonthlySubscriptionPrice(subs.price, subs.planDuration)
                )}
                isActive={subs.isActive}
                autoRenew={subs.autoRenew}
                planDuration={subs.planDuration}
                _id={""}
                dueDate={""}
              />
            ))}
          </div>

          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </>
      ) : (
        <div className="flex items-center justify-center p-[200px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Subscriptions! 🥺
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              You haven`t added any subscriptions yet. Click the button below to
              get started tracking your expenses.
            </p>
            <Button
              className="mt-6 bg-teal-500 hover:bg-teal-600 text-white rounded-xl"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Subscription
            </Button>
          </div>
        </div>
      )}

      <AddSubscriptionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddSubscription={handleAddSubscription}
      />
    </div>
  );
}
