import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Eye, EyeOff, Loader2, User2 } from "lucide-react";
import axios, { AxiosError } from "axios";

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useAuthView } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useNavigate } from 'react-router-dom'; 

// Schéma de validation
const loginSchema = z.object({
  username: z.string().min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
  timestamp: string;
  path: string;
};

interface ApiError {
  message: string;
  status: number;
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { setView } = useAuthView();
  const {setUser} = useUser()
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("authToken")
    if(token) navigate('/main');
  },[])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError("");
    try {
      const response = await axios.post<LoginResponse>(import.meta.env.VITE_BASE_URL+"/auth/login", data);
      const token = response.data.data.token;
      localStorage.setItem("authToken", token);
      setUser({username: data.username})
      navigate('/main');
     
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error("Erreur de connexion:", error);
      setApiError(
        axiosError.response?.data?.message ||
        "Échec de la connexion. Veuillez vérifier vos identifiants."
      );
    }
  };

  return (
    <Card className="h-full flex justify-center">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <CardDescription className="text-center">
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center">
            {apiError && (
              <div className="w-2/3 text-sm text-red-500 font-medium">{apiError}</div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Votre nom d'utilisateur" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <div className="flex justify-between items-center">
                    <FormLabel>Mot de passe</FormLabel>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Mot de passe oublié?
                    </a>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-2/3" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : "Se connecter"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Pas encore de compte?{" "}
          <a href="#" onClick={() => setView("register")} className="text-primary font-medium hover:underline">
            S'inscrire
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
