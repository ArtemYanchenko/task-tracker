import { ResponseType } from "common/dal/api";
import { Dispatch } from "redux";
import { appActions } from "app/appReducer";

/**
 *
 * @param data
 * @param dispatch
 * @param showError
 */

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  } else {
    dispatch(appActions.setStatus({ status: "failed" }));
  }
};
