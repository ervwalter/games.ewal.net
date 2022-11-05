// this doesn't seem to make a difference either
// export const dynamic = "force-static";

async function getTime() {
  const res = await fetch("http://worldtimeapi.org/api/timezone/America/Chicago", { next: { revalidate: 30 } });
  const time = await res.json();
  return time;
}

export default async function Debug() {
  const time = await getTime();

  return (
    <div>
      <pre>
        <code>{JSON.stringify(time, undefined, 2)}</code>
      </pre>
    </div>
  );
}
