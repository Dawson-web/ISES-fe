import {
  Button,
  Group,
  PasswordInput,
  TextInput,
  NumberInput,
  Checkbox,
  FileInput,
} from "@mantine/core";
import AppLogo from "../public/app-logo";

export default function Form(props: any) {
  const { form_config, form, fn } = props;

  return (
    <div className=" flex flex-col items-center gap-8">
      <div className="flex items-center gap-2">
        <AppLogo />
        <div className="font-comfortaa text-xl font-semibold">
          | {form_config.title || "表单"}
        </div>
      </div>
      <form
        onSubmit={form.onSubmit((v: any) => fn(v))}
        className="relative flex w-[30vw] min-w-[320px] max-w-[400px]  flex-col gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md"
      >
        {form_config.fields.map((field: any) => {
          switch (field.type) {
            case "text":
              return (
                <TextInput
                  label={field.label || field.key}
                  key={form.key(field.key)}
                  {...form.getInputProps(field.key)}
                />
              );
            case "password":
              return (
                <PasswordInput
                  label={field.label || field.key}
                  key={form.key(field.key)}
                  {...form.getInputProps(field.key)}
                />
              );
            case "number":
              return (
                <NumberInput
                  label={field.label || field.key}
                  key={form.key(field.key)}
                  {...form.getInputProps(field.key)}
                />
              );
            case "checkbox":
              return (
                <Checkbox
                  label={field.label || "I agree to sell my privacy"}
                  key={form.key(field.key)}
                  {...form.getInputProps(field.key)}
                  {...form.getInputProps(field.key, { type: "checkbox" })}
                />
              );
            case "file":
              return (
                <FileInput
                  label={field.label || field.key}
                  key={form.key(field.key)}
                  {...form.getInputProps(field.key)}
                />
              );
          }
        })}

        <Group justify="flex-end" mt="md">
          <Button type="submit">提交</Button>
        </Group>

        <div className="absolute inset-x-0 top-0 h-1 bg-theme_blue"></div>
      </form>
    </div>
  );
}
