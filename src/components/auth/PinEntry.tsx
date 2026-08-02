import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PinEntry({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle keyboard input on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;

      // Number keys (0-9)
      if (/^\d$/.test(e.key) && pin.length < 4) {
        e.preventDefault();
        setPin((prev) => prev + e.key);
      }
      // Backspace
      else if (e.key === "Backspace") {
        e.preventDefault();
        setPin((prev) => prev.slice(0, -1));
      }
      // Enter to submit
      else if (e.key === "Enter" && pin.length === 4) {
        e.preventDefault();
        handleSubmit();
      }
      // Escape to cancel
      else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, loading, onCancel]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    setLoading(true);
    try {
      // For testing, accept any 4-digit PIN immediately
      console.log("PIN entered:", pin);
      
      // Simulate minimal verification delay (100ms instead of 500ms)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      onSuccess();
    } catch (error) {
      console.error("PIN verification error:", error);
      toast.error("PIN verification failed");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const isTouchDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="glass-card w-full max-w-sm p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-primary/30 text-primary">
            <Lock className="size-5" />
          </div>
          <h2 className="font-display text-2xl font-semibold">Enter PIN</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            4-digit secure access code
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="size-12 rounded-xl border-2 border-border bg-secondary/50 flex items-center justify-center font-display text-2xl font-bold"
            >
              {pin[i] ? "•" : ""}
            </div>
          ))}
        </div>

        {/* Keyboard input hint for desktop, keypad for mobile */}
        {isTouchDevice() ? (
          <>
            {/* Keypad for Touch Devices */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  onClick={() => handleNumberClick(String(num))}
                  disabled={loading || pin.length === 4}
                  className="h-12 text-lg font-semibold rounded-xl"
                  variant="outline"
                >
                  {num}
                </Button>
              ))}
              <Button
                onClick={() => handleNumberClick("0")}
                disabled={loading || pin.length === 4}
                className="col-span-3 h-12 text-lg font-semibold rounded-xl"
                variant="outline"
              >
                0
              </Button>
            </div>

            {/* Backspace and Submit for Touch */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleBackspace}
                disabled={loading || pin.length === 0}
                className="h-12 rounded-xl"
                variant="outline"
              >
                Delete
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || pin.length !== 4}
                className="h-12 rounded-xl"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify"}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Keyboard instructions for Desktop */}
            <div className="mb-6 p-4 bg-secondary/50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Type 4 digits</span> on your keyboard
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Press <span className="font-mono font-semibold">Enter</span> to verify or{" "}
                <span className="font-mono font-semibold">Esc</span> to cancel
              </p>
            </div>

            {/* Submit button for Desktop (optional visual feedback) */}
            <Button
              onClick={handleSubmit}
              disabled={loading || pin.length !== 4}
              className="w-full h-12 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify (or press Enter)"
              )}
            </Button>
          </>
        )}

        {/* Cancel Button */}
        <Button
          onClick={onCancel}
          disabled={loading}
          className="w-full mt-4 rounded-xl"
          variant="ghost"
        >
          Cancel (or press Esc)
        </Button>
      </div>
    </motion.div>
  );
}
