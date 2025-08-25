import ClientView from './view';
export default function G({ params }:{ params:{ token:string }}){ return <ClientView token={params.token} />; }
