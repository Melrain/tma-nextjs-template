"use client";

import { List, Placeholder } from "@telegram-apps/telegram-ui";
import { DisplayData } from "@/components/DisplayData/DisplayData";
import { Page } from "@/components/Page";
import { useInitData } from "@/utils/initDataUtil";
import Image from "next/image";

export default function InitDataPage() {
  const { initDataRows, userRows, receiverRows, chatRows } = useInitData();

  if (!initDataRows) {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data">
          <Image
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: "block", width: "144px", height: "144px" }}
          />
        </Placeholder>
      </Page>
    );
  }
  return (
    <Page>
      <List>
        <DisplayData
          header={"Init Data"}
          rows={initDataRows}
        />
        {userRows && (
          <DisplayData
            header={"User"}
            rows={userRows}
          />
        )}
        {receiverRows && (
          <DisplayData
            header={"Receiver"}
            rows={receiverRows}
          />
        )}
        {chatRows && (
          <DisplayData
            header={"Chat"}
            rows={chatRows}
          />
        )}
      </List>
    </Page>
  );
}
