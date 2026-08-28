import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function FormTextarea({
  name,
  label,
  defaultValue = "",
  placeholder,
  required = false,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
}

export default FormTextarea;
