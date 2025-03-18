"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "../../components/registerForm/Particles";
import { Toggle } from "../../components/registerForm/Toggle";
import { Input } from "../../components/registerForm/Input";
import { Textarea } from "../../components/registerForm/Textarea";
import Image from "next/image";

interface FormData {
  role: "seller" | "customer";
  storeName?: string;
  storeDescription?: string;
  shippingAddress?: string;
}

export default function CompleteProfile() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { role: "customer" },
  });
  const selectedRole = watch("role");
  const [formStep, setFormStep] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Optional: Check if the user already has a record in your DB
  useEffect(() => {

  }, [user]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    const payload = {
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.firstName || user.fullName,
      role: data.role === "seller" ? "seller" : "customer",
      storeName: data.role === "seller" ? data.storeName : undefined,
      storeDescription: data.role === "seller" ? data.storeDescription : undefined,
      shippingAddress: data.role === "customer" ? data.shippingAddress : undefined,
    };

    try {
      // Show animated registration completion UI
      setRegistrationComplete(true);
      
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        // Wait for animation to complete
        setTimeout(() => {
          router.push(data.role === "seller" ? "/seller/dashboard" : "/");
        }, 2000);
      } else {
        setRegistrationComplete(false);
        throw new Error("Registration failed");
      }
    } catch (error) {
      setRegistrationComplete(false);
      console.error("Error during registration", error);
    }
  };

  const handleRoleChange = (value: string) => {
    // Cast the string value to our FormData's role type
    const role = value as "seller" | "customer";
    setValue("role", role);
    // Clear the fields for the other role
    if (role === "seller") {
      setValue("shippingAddress", undefined);
    } else {
      setValue("storeName", undefined);
      setValue("storeDescription", undefined);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Background particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles />
      </div>
      
      {/* Glass morphism card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4 backdrop-blur-md bg-white/80 rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20"
      >
        {registrationComplete ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mb-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
            <p className="text-gray-600">Redirecting you to your personalized experience...</p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Complete Your Profile</h2>
              <motion.div 
                whileHover={{ rotate: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/logo.svg" alt="Logo" width={36} height={36} />
              </motion.div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {formStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="inline-block font-medium text-gray-700 mb-2">I want to:</label>
                      <Toggle
                        options={[
                          { value: "customer", label: "Shop" },
                          { value: "seller", label: "Sell" },
                        ]}
                        value={selectedRole}
                        onChange={handleRoleChange}
                      />
                    </div>
                    
                    <motion.button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="w-full relative group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center">
                        <span>Continue</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </div>
                    </motion.button>
                  </motion.div>
                )}
                
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {selectedRole === "seller" ? (
                      <>
                        <Input
                          label="Store Name"
                          placeholder="Enter your store name"
                          error={errors.storeName?.message}
                          {...register("storeName", { required: "Store name is required" })}
                        />
                        <Textarea
                          label="Store Description"
                          placeholder="Tell shoppers about your products and brand"
                          error={errors.storeDescription?.message}
                          rows={4}
                          {...register("storeDescription", { required: "Store description is required" })}
                        />
                      </>
                    ) : (
                      <Input
                        label="Shipping Address"
                        placeholder="Enter your full shipping address"
                        error={errors.shippingAddress?.message}
                        {...register("shippingAddress", { required: "Shipping address is required" })}
                      />
                    )}
                    
                    <div className="flex space-x-4">
                      <motion.button
                        type="button"
                        onClick={() => setFormStep(0)}
                        className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                      
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 relative group overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center">
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <span>Complete</span>
                              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}