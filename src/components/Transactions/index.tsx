import { useCallback } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  /* bug-7 fix: added a call to the `clearCacheByEndpoint` fuction in the 
  useCustomFetch() hook in order to clear the cacheded data for the 
  paginatedTransactions endpoint and the transactionsByEmployee endpoint. 
  See line 24. */
  const { fetchWithoutCache, clearCacheByEndpoint, loading } = useCustomFetch();

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>(
        "setTransactionApproval",
        {
          transactionId,
          value: newValue,
        }
      );
      // clear cacheded data for paginatedTransactions and transactionsByEmployee
      clearCacheByEndpoint(["paginatedTransactions", "transactionsByEmployee"]);
    },
    [fetchWithoutCache, clearCacheByEndpoint]
  );

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  );
};
