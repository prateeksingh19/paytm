export default function TransactionStatus({ status }: { status: string }) {
  return (
    <div className="ml-4 mt-0.5 flex justify-center text-xs">
      {status === "Success" ? (
        <div className="text-green-500">Success</div>
      ) : status === "Processing" ? (
        <div className="animate-blink text-yellow-400 border-red-500">
          Processing
        </div>
      ) : (
        <div className="text-red-500">Failed</div>
      )}
    </div>
  );
}
