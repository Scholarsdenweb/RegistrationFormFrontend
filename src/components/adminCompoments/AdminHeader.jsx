const AdminHeader = ({ title, subtitle }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mb-5 sm:mb-6 rounded-2xl border border-white bg-white/80 px-4 py-4 sm:px-6 shadow-[0_12px_30px_rgba(157,23,33,0.06)]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        <span className="inline-flex w-fit rounded-full border border-[#f5c9cc] bg-[#fde9ea] px-3 py-1 text-xs font-semibold text-[#9f1239]">
          {today}
        </span>
      </div>
    </div>
  );
};

export default AdminHeader;
