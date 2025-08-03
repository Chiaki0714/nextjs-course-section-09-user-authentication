export default function FormError({ error }) {
  if (!error) return null;

  return (
    <span className='form-error' aria-live='polite'>
      {error}
    </span>
  );
}
