import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function TaskDelete({ isOpen, onClose, onConfirm, isPending }: TaskDeleteProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-gray-900/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-sm w-full mx-4 shadow-xl relative z-10 animate-in fade-in duration-300">
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Delete Task</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="mr-2"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
