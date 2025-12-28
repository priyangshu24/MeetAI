"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function Newsletter() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Successfully subscribed to our newsletter!")
    form.reset()
  }

  return (
    <div className="bg-primary/5 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto my-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Stay updated</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Subscribe to our newsletter to receive the latest updates, news and exclusive offers.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="name@example.com" {...field} className="bg-background h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="h-11">Subscribe</Button>
        </form>
      </Form>
    </div>
  )
}
