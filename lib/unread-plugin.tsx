import {
  React,
  FocusedContentStore,
  Thread,
  FocusedPerspectiveStore
} from "mailspring-exports";
import databaseStore from "../../Mailspring/app/src/flux/stores/database-store";

interface UnreadPluginState {
  content: Thread;
}

export default class UnreadPlugin extends React.Component<
  {},
  UnreadPluginState
> {
  static displayName = "UnreadPlugin";

  unsubscribers = [];

  // This sidebar component listens to the FocusedContactStore,
  // which gives us access to the Contact object of the currently
  // selected person in the conversation. If you wanted to take
  // the contact and fetch your own data, you'd want to create
  // your own store, so the flow of data would be:

  // FocusedContactStore => Your Store => Your Component
  constructor(props) {
    super(props);
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    console.log("UnreadComponent Mounted!");
    this.unsubscribers.push(FocusedContentStore.listen(this._onChange));
    this.unsubscribers.push(FocusedPerspectiveStore.listen(this._onChange));
    this.unsubscribers.push(databaseStore.listen(this._onChange));
  }

  componentWillUnmount() {
    this.unsubscribers.map(unsubscribe => unsubscribe());
  }

  _onChange = () => {
    this.setState(this._getStateFromStores());
    console.log(FocusedPerspectiveStore.current().threads());
    console.log(FocusedPerspectiveStore.current().threads());
    console.log(this.state);
  };

  _getStateFromStores = () => {
    return {
      content: FocusedContentStore.focused("thread")
    };
  };

  _renderContent() {
    // Want to include images or other static assets in your components?
    // Reference them using the mailspring:// URL scheme:
    //
    // <RetinaImg
    //    url="mailspring://<<package.name>>/assets/checkmark_templatethis.2x.png"
    //    mode={RetinaImg.Mode.ContentIsMask}/>
    //
    return (
      <div className="heading">
        <h1>{this.state.content.subject} is the focused content.</h1>
      </div>
    );
  }

  _renderPlaceholder() {
    return <div> No Data Available </div>;
  }

  render() {
    const content = this.state.content
      ? this._renderContent()
      : this._renderPlaceholder();
    return <div className="unread-plugin">{content}</div>;
  }
}
