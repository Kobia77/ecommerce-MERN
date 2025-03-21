"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Image from "next/image";

// Components
// import { Step } from "../../components/registerForm/Step";
// import { Toggle } from "../../components/registerForm/Toggle";
import { Input } from "../../components/registerForm/Input";
import { Textarea } from "../../components/registerForm/Textarea";

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormData {
  role: "seller" | "customer";
  storeName?: string;
  storeDescription?: string;
  shippingAddress?: string;
  profilePictureUrl?: string;
  address: AddressFormData;
}

export default function CompleteProfile() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      role: "customer",
      address: { street: "", city: "", state: "", postalCode: "", country: "" },
    },
  });

  const selectedRole = watch("role");
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(3);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Form sections visibility
  const showRoleSelection = currentStep === 1;
  const showProfileDetails = currentStep === 2;
  const showAddressDetails = currentStep === 3;

  useEffect(() => {}, [user]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    const payload = {
      role: data.role,
      storeName: data.role === "seller" ? data.storeName : undefined,
      storeDescription:
        data.role === "seller" ? data.storeDescription : undefined,
      shippingAddress:
        data.role === "customer" ? data.shippingAddress : undefined,
      profilePictureUrl: data.profilePictureUrl,
      address: data.address,
    };

    try {
      setRegistrationComplete(true);

      const res = await fetch(`/api/user/register/${selectedRole}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setTimeout(() => {
          router.push(
            data.role === "seller" ? "/dashboard/seller" : "/dashboard/customer"
          );
        }, 800);
      } else {
        setRegistrationComplete(false);
        throw new Error("Registration failed");
      }
    } catch (error) {
      setRegistrationComplete(false);
      if (process.env.NODE_ENV !== "production") {
        console.error("Error during registration", error);
      }
    }
  };

  const handleRoleChange = (value: string) => {
    const role = value as "seller" | "customer";
    setValue("role", role);
    if (role === "seller") {
      setValue("shippingAddress", undefined);
    } else {
      setValue("storeName", undefined);
      setValue("storeDescription", undefined);
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* Header */}
      <header className="py-4 px-6 border-b border-neutral-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={24} height={24} />
          <span className="font-medium text-lg">ShopNow</span>
        </div>
        {!registrationComplete && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{
                  width: `${((currentStep - 1) / totalSteps) * 100}%`,
                }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-6">
        {registrationComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center my-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">Profile Complete!</h2>
            <p className="text-neutral-500">
              Welcome to ShopNow. Redirecting you to your dashboard...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-xl font-semibold mb-4">
                {showRoleSelection && "Choose Your Role"}
                {showProfileDetails &&
                  `Set Up Your ${
                    selectedRole === "seller" ? "Store" : "Profile"
                  }`}
                {showAddressDetails && "Add Your Address"}
              </h1>

              {/* Step 1: Role Selection */}
              {showRoleSelection && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <p className="text-neutral-500 mb-4">
                      Choose how you'd like to use ShopNow:
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedRole === "customer"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                        onClick={() => handleRoleChange("customer")}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Customer</h3>
                          {selectedRole === "customer" && (
                            <svg
                              className="w-5 h-5 text-indigo-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500">
                          Shop and discover products from various sellers
                        </p>
                      </div>

                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedRole === "seller"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                        onClick={() => handleRoleChange("seller")}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Seller</h3>
                          {selectedRole === "seller" && (
                            <svg
                              className="w-5 h-5 text-indigo-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500">
                          Create your store and sell products to customers
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile Details */}
              {showProfileDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {selectedRole === "seller" ? (
                    <>
                      <Input
                        label="Store Name"
                        placeholder="Enter your store name"
                        error={errors.storeName?.message}
                        {...register("storeName", {
                          required: "Store name is required",
                        })}
                      />
                      <Textarea
                        label="Store Description"
                        placeholder="Tell shoppers about your products and brand"
                        error={errors.storeDescription?.message}
                        rows={3}
                        {...register("storeDescription", {
                          required: "Store description is required",
                        })}
                      />
                    </>
                  ) : (
                    <Input
                      label="Shipping Address"
                      placeholder="Enter your primary shipping address"
                      error={errors.shippingAddress?.message}
                      {...register("shippingAddress", {
                        required: "Shipping address is required",
                      })}
                    />
                  )}

                  <Input
                    label="Profile Picture URL"
                    placeholder="Enter URL for your profile image (optional)"
                    error={errors.profilePictureUrl?.message}
                    {...register("profilePictureUrl")}
                  />
                </motion.div>
              )}

              {/* Step 3: Address Details */}
              {showAddressDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Street Address"
                      placeholder="Enter your street address"
                      error={errors.address?.street?.message}
                      {...register("address.street", {
                        required: "Street address is required",
                      })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        placeholder="City"
                        error={errors.address?.city?.message}
                        {...register("address.city", {
                          required: "City is required",
                        })}
                      />
                      <Input
                        label="State/Province"
                        placeholder="State/Province"
                        error={errors.address?.state?.message}
                        {...register("address.state", {
                          required: "State is required",
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Postal Code"
                        placeholder="Postal Code"
                        error={errors.address?.postalCode?.message}
                        {...register("address.postalCode", {
                          required: "Postal code is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Postal code must contain only numbers",
                          },
                        })}
                      />
                      <Input
                        label="Country"
                        placeholder="Country"
                        error={errors.address?.country?.message}
                        {...register("address.country", {
                          required: "Country is required",
                        })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2.5 text-neutral-600 font-medium text-sm rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Profile</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
