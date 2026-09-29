import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./api";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => navigate("/login"),
  });
}