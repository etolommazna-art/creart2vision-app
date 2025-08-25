import GuestView from './view';
export default function GV({ params }:{ params:{ token:string }}){ return <GuestView token={params.token} />; }
