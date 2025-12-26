import { router} from "expo-router";
import { authService } from "@/api/auth";
import { useEffect } from "react";

export default function Index() {

    useEffect(() => {
        authService.initializeAuth().then((user) => {
            if (user) {
                router.replace("/(tabs)/notes");
            } else {
                router.replace("/login");
            }
        });
    }, []);
  return null;
}