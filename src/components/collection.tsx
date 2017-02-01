import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {CollectionStore} from '../stores/collection-store';

@inject("collectionStore")
@observer
export default class RecentPlays extends React.Component<{collectionStore?: CollectionStore},{}> {
  render() {
      return (
          <div></div>
      )
  }
};