interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export default function PrettyJSON({ data }: Props) {
    return (
        <div className="overflow-x-auto">
            <pre className="break-words whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
