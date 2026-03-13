import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import generateSlug from "@/lib/util/generateSlug";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tierName: string;
  onSubmit: (workspaceName: string, slug: string) => void;
  isLoading?: boolean;
};

const CreateWorkspaceModal = ({
  isOpen,
  onClose,
  tierName,
  onSubmit,
  isLoading,
}: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const previewSlug = name ? generateSlug(name.trim()) : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Workspace name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 50) {
      setError("Workspace name must be less than 50 characters");
      return;
    }

    setError("");
    onSubmit(trimmed, generateSlug(trimmed));
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace with the{" "}
            <strong className="text-primary">{tierName}</strong> plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              ref={nameRef}
              name="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Workspace Name"
              autoComplete="off"
            />

            {previewSlug && (
              <p className="text-muted-foreground text-xs">
                URL: <span className="font-mono">{previewSlug}</span>
              </p>
            )}

            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Creating..." : "Continue to Checkout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
