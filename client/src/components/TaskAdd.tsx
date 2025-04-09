import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TaskAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority: string }) => void;
  isPending: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }),
  description: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});

export default function TaskAdd({ isOpen, onClose, onSubmit, isPending }: TaskAddProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
    },
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      title: data.title,
      description: data.description || "",
      priority: data.priority,
    });
    form.reset();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-gray-900/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl relative z-10 animate-in fade-in duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Task</h3>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What needs to be done?" 
                        {...field} 
                        autoFocus
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add some details about this task..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="priority-low" />
                          <Label htmlFor="priority-low">Low</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="priority-normal" />
                          <Label htmlFor="priority-normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="priority-high" />
                          <Label htmlFor="priority-high">High</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
