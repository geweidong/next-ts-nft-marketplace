import { truncateStr } from "@/utils";
import { useAccount, useDisconnect, useEnsName, Connector, useChainId, useConnect } from 'wagmi';
import { useEffect, useState } from "react";

const Account = () => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

  const formattedAddress = truncateStr(address!, 10);

  return (
    <div className="row">
      <div className="inline">
        <div className="stack">
          {address && (
            <div className="text">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            </div>
          )}
          <div className="subtext">
            Connected to {connector?.name} Connector
          </div>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => disconnect()} type="button">
        Disconnect
      </button>
    </div>
  );
}

const ConnectorButton = ({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      disabled={!ready}
      onClick={onClick}
      type="button"
    >
      {connector.name}
    </button>
  );
}

const Connect = () => {
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const [dataList, setDataList] = useState<readonly Connector[]>([]);

  useEffect(() => {
    setDataList(connectors);
  }, [connectors])

  return (
    <div>
      {dataList.map((connector) => (
        <ConnectorButton
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector, chainId })}
        />
      ))}
    </div>
  );
}

export default function ConnectButton() {
  const { isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(isConnected);
  }, [isConnected]);

  return (
    <div>
      {isMounted ? <Account /> : <Connect />}
    </div>
  )
}