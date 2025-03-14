import { useAuth } from '@clerk/clerk-react'


console.log("Hello World!");

const getToken = async () => {
  const { getToken } = useAuth();
  const token = await getToken();
  console.log("Token:", token);
};

getToken();
