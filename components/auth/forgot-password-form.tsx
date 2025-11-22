"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { forgotPassword, resetPassword } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z
  .object({
    otp: z.string().length(4, "OTP must be 4 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {step === "EMAIL" ? "Forgot Password" : "Reset Password"}
        </CardTitle>
        <CardDescription>
          {step === "EMAIL"
            ? "Enter your email to receive a password reset OTP."
            : `Enter the OTP sent to ${email} and your new password.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "EMAIL" ? (
          <EmailForm
            onSuccess={(email) => {
              setEmail(email);
              setStep("OTP");
            }}
          />
        ) : (
          <ResetForm email={email} onBack={() => setStep("EMAIL")} />
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/sign-in" className="text-sm text-primary hover:underline">
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}

function EmailForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onEmailSubmit(values: EmailValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);

      const result = await forgotPassword(null, formData);

      if (result?.errors) {
        Object.entries(result.errors).forEach(([key, errors]) => {
          emailForm.setError(key as any, { message: errors[0] });
        });
      } else if (result?.message) {
        if (result.success) {
          toast.success(result.message);
          onSuccess(values.email);
        } else {
          toast.error(result.message);
        }
      }
    });
  }

  return (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-4"
      >
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </Form>
  );
}

function ResetForm({ email, onBack }: { email: string; onBack: () => void }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onResetSubmit(values: ResetValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", values.otp);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);

      const result = await resetPassword(null, formData);

      if (result?.errors) {
        Object.entries(result.errors).forEach(([key, errors]) => {
          resetForm.setError(key as any, { message: errors[0] });
        });
      } else if (result?.message) {
        if (result.success) {
          toast.success(result.message);
          router.push("/sign-in");
        } else {
          toast.error(result.message);
        }
      }
    });
  }

  return (
    <Form {...resetForm}>
      <form
        onSubmit={resetForm.handleSubmit(onResetSubmit)}
        className="space-y-4"
      >
        <FormField
          control={resetForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={resetForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={resetForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
          disabled={isPending}
        >
          Back to Email
        </Button>
      </form>
    </Form>
  );
}
