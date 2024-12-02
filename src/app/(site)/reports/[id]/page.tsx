export default function ReportDetailPage({ params }: { params: { id: string } }) {
 return (
   <div>
     <h1>Report Detail {params.id}</h1>
   </div>
 )
}
