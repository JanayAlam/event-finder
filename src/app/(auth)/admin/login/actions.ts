import { axiosInstance } from "@/axios";
import { AxiosError } from "axios";
import { AdminLoginDTOSchema } from "../../../../../server/validationSchemas/admin";

interface State {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
}

export const adminLoginHandler = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const requestBody = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  const result = AdminLoginDTOSchema.safeParse(requestBody);

  if (!result.success) {
    console.log(result.error);

    return {
      errors: {
        general: "Validation error"
      }
    };
  }

  try {
    await axiosInstance.post("/admins/login", result.data);
    window.location.href = "/";
    return {};
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 400) {
        return {
          errors: {
            email: err.response.data.email,
            password: err.response.data.password
          }
        };
      }
      return {
        errors: { general: err.message }
      };
    }
    return {
      errors: { general: (err as Error).message }
    };
  }
};
