"use client";

import { PlayerAction, ActionType } from "@/types/GameTypes";

export function useAvailableAction(availableActions: PlayerAction[]) {
  const get = (type: ActionType) => {
    return availableActions.find((action) => action.type === type);
  };

  return {
    foldAction: get(ActionType.Fold),
    checkAction: get(ActionType.Check),
    callAction: get(ActionType.Call),
    betAction: get(ActionType.Bet),
    raiseAction: get(ActionType.Raise),
    allInAction: get(ActionType.AllIn),
    callAllInAction: get(ActionType.CallAllIn),
    raiseAllInAction: get(ActionType.RaiseAllIn),
  };
}
