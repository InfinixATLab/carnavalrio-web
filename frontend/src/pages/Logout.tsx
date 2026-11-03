import Spinner from "../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ACCESS_TOKEN, EMAIL, NAME, SURNAME, REFRESH_TOKEN } from "../constants/Token";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(EMAIL);
    localStorage.removeItem(NAME);
    localStorage.removeItem(SURNAME);

    navigate("/infinix/");
  }, [navigate]);

  return <Spinner />;
}

export default Logout;
