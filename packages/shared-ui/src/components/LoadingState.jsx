export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center text-[#746a61]">
      {message}
    </div>
  );
}
