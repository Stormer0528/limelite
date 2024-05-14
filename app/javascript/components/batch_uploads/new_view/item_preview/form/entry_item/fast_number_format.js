import PropTypes from "prop-types";
import {useCallback, forwardRef} from "react";
import {useField} from "formik";
import NumberFormat from "react-number-format";
import {useLazyQuery} from "@apollo/react-hooks";
import capitalize from "lodash/capitalize";
import gql from "graphql-tag";

const FastNumberFormat = forwardRef(({code, name, ...props}, ref) => {
  const [field, , {setError}] = useField(name);
  const elemName = props.placeholder;
  const [validateCode] = useLazyQuery(
    gql`
  query($code: String) {
    element: account${capitalize(elemName)}ByCode(code: $code) {
      id
    }
  }
  `,
    {
      partialRefetch: true,
      onCompleted: ({element: isValid = false}) => {
        if (!isValid) {
          setError(`${code} is not a valid ${elemName} code`);
        }
      },
    }
  );

  const handleBlur = useCallback(
    (e) => {
      const {value: code} = e.target;
      if (code) {
        validateCode({variables: {code}});
      }
    },
    [validateCode]
  );

  return <NumberFormat {...field} {...props} onBlur={handleBlur} ref={ref} />;
});

FastNumberFormat.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  code: PropTypes.string,
  placeholder: PropTypes.string,
};

export default FastNumberFormat;
