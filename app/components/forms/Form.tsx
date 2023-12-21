import { Formik, FormikProps } from "formik";
import { ReactNode, Ref } from "react";

interface FormProps {
  children: ReactNode;
  initialValues: Object;
  onSubmit: (
    values: any,
    {
      resetForm,
    }: {
      resetForm: (arg0: { values: any }) => void;
    }
  ) => void;
  formRef?: Ref<FormikProps<any>>;
  validationSchema: Object;
}

export default function Form({
  children,
  initialValues,
  onSubmit,
  formRef,
  validationSchema,
}: FormProps) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      innerRef={formRef}
      validationSchema={validationSchema}
    >
      {() => children}
    </Formik>
  );
}
