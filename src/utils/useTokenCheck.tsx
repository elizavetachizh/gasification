import { useEffect, useState } from "react";
import { useAppSelector } from "@/src/lib/hooks";

const useTokenCheck = (Component: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const { accessToken } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    console.log(accessToken);
    useEffect(() => {
      if (accessToken) {
        setIsLoading(false);
      }
    }, [accessToken]);

    return isLoading ? <div>Loading...</div> : <Component {...props} />;
  };
};

export default useTokenCheck;
