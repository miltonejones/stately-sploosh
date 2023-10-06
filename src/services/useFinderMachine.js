import { getVideosByText, getVideosByURL } from "../connector/parser";
import { finderMachine } from "../machines/finderMachine";
import { useMachine } from "@xstate/react";

export const useFinderMachine = (onComplete) => {
  const [state, send] = useMachine(finderMachine, {
    services: {
      sendCompeteSignal: async () => {
        onComplete && onComplete();
      },
      searchByURL: async (context) => {
        const res = await getVideosByURL(context.URL);
        return res.videos;
      },
      searchByPage: async (context) => {
        const currentPage = context.addresses[context.page_index];
        const [address] = currentPage;
        const res = await getVideosByURL(address);
        return res.videos;
      },
      searchByText: async (context) => {
        const currentDomain = context.selected[context.search_index];
        const address = `https://${currentDomain}`;
        const answer = await getVideosByText(address + "/", context.param);
        return answer;
      },
    },
  });
  const beginSearch = (param) =>
    send({
      type: state.can("start") ? "start" : "append",
      param,
    });

  return {
    diagnosticProps: {
      id: finderMachine.id,
      states: finderMachine.states,
      state,
    },
    state,
    send,
    ...state.context,
    beginSearch,
  };
};
