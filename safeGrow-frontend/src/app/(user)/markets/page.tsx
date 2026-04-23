import ViewLayout from "../../../components/ViewLayout/ViewLayout";
export default function MarketsPage() {
    return (
        <ViewLayout initialRole="user">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-[#111111]">Markets</h1>
                <p className="text-sm text-[#495057] mt-1">Live market data coming soon.</p>
            </div>
        </ViewLayout>
    );
}