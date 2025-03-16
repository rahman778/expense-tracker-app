import { useSearchParams } from "react-router-dom";

type QueryParamKey = string;
type QueryParamValue = string | null;

const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParam = (key: QueryParamKey, value: QueryParamValue) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      return newParams;
    });
  };

  const getQueryParam = (key: QueryParamKey): QueryParamValue => {
    return searchParams.get(key);
  };

  return { updateQueryParam, getQueryParam };
};

export default useQueryParams;
