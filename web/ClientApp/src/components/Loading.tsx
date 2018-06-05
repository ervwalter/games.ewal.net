import { inject, observer } from "mobx-react";
import React from "react";
import { CollectionStore } from "~/stores/CollectionStore";
import { PlayStore } from "~/stores/PlayStore";

@inject("collectionStore", "playStore")
@observer
export default class Loading extends React.Component<{
  collectionStore?: CollectionStore;
  playStore?: PlayStore;
}> {
  render() {
    const { collectionStore, playStore } = this.props;
    if (collectionStore!.isLoading || playStore!.isLoading) {
      return <div className="button is-loading" />;
    } else {
      return null;
    }
  }
}
