import React from 'react'
import FileReaderInput from 'react-file-reader-input'

import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'
import OpenIcon from 'react-icons/lib/md/open-in-browser'
import SettingsIcon from 'react-icons/lib/md/settings'
import MdInfo from 'react-icons/lib/md/info'
import SourcesIcon from 'react-icons/lib/md/layers'
import MdSave from 'react-icons/lib/md/save'
import MdStyle from 'react-icons/lib/md/style'
import MdMap from 'react-icons/lib/md/map'
import MdInsertEmoticon from 'react-icons/lib/md/insert-emoticon'
import MdFontDownload from 'react-icons/lib/md/font-download'
import HelpIcon from 'react-icons/lib/md/help-outline'
import InspectionIcon from 'react-icons/lib/md/find-in-page'
import AddIcon from 'react-icons/lib/md/add-circle-outline'

import logoImage from '../img/maputnik.png'
import AddModal from './modals/AddModal'
import SettingsModal from './modals/SettingsModal'
import SourcesModal from './modals/SourcesModal'
import OpenModal from './modals/OpenModal'

import style from '../libs/style'
import colors from '../config/colors'
import { margins, fontSizes } from '../config/scales'

const IconText = props => <span style={{ paddingLeft: margins[0] }}>
  {props.children}
</span>

const actionStyle = {
  display: "inline-block",
  padding: 10,
  fontSize: fontSizes[4],
  cursor: "pointer",
  color: colors.white,
  textDecoration: 'none',
}

const ToolbarLink = props => <a
  href={props.href}
  target={"blank"}
  style={{
    ...actionStyle,
    ...props.style,
  }}>
  {props.children}
</a>

class ToolbarAction extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  render() {
    return <a
      onClick={this.props.onClick}
      onMouseOver={e => this.setState({hover: true})}
      onMouseOut={e => this.setState({hover: false})}
      style={{
        ...actionStyle,
        ...this.props.style,
        backgroundColor: this.state.hover ? colors.gray : null,
      }}>
      {this.props.children}
    </a>
  }
}

export default class Toolbar extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    // A new style has been uploaded
    onStyleOpen: React.PropTypes.func.isRequired,
    // Current style is requested for download
    onStyleDownload: React.PropTypes.func.isRequired,
    // A dict of source id's and the available source layers
    sources: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: {
        settings: false,
        sources: false,
        open: false,
        add: false,
      }
    }
  }

  downloadButton() {
    return <ToolbarAction onClick={this.props.onStyleDownload}>
      <MdFileDownload />
      <IconText>Download</IconText>
    </ToolbarAction>
  }

  toggleInspectionMode() {
    const metadata = this.props.mapStyle.metadata || {}
    const currentRenderer = metadata['maputnik:renderer'] || 'mbgljs'

    const changedRenderer = currentRenderer === 'inspection' ? 'mbgljs' : 'inspection'

    const changedStyle = {
      ...this.props.mapStyle,
      metadata: {
        ...this.props.mapStyle.metadata,
        'maputnik:renderer': changedRenderer
      }
    }

    this.props.onStyleChanged(changedStyle)
  }

  toggleModal(modalName) {
    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [modalName]: !this.state.isOpen[modalName]
      }
    })
  }

  render() {
    return <div style={{
      position: "fixed",
      height: 40,
      width: '100%',
      zIndex: 100,
      left: 0,
      top: 0,
      backgroundColor: colors.black
    }}>
      <SettingsModal
        mapStyle={this.props.mapStyle}
        onStyleChanged={this.props.onStyleChanged}
        isOpen={this.state.isOpen.settings}
        onOpenToggle={this.toggleModal.bind(this, 'settings')}
      />
      <OpenModal
        isOpen={this.state.isOpen.open}
        onStyleOpen={this.props.onStyleOpen}
        onOpenToggle={this.toggleModal.bind(this, 'open')}
      />
      <SourcesModal
          mapStyle={this.props.mapStyle}
          onStyleChanged={this.props.onStyleChanged}
          isOpen={this.state.isOpen.sources}
          onOpenToggle={this.toggleModal.bind(this, 'sources')}
      />
      <AddModal
          mapStyle={this.props.mapStyle}
          sources={this.props.sources}
          isOpen={this.state.isOpen.add}
          onOpenToggle={this.toggleModal.bind(this, 'add')}
          onStyleChange={this.props.onStyleChanged}
      />
      <ToolbarLink
        href={"https://github.com/maputnik/editor"}
        style={{
          width: 180,
          textAlign: 'left',
          backgroundColor: colors.black,
          padding: 5,
        }}
      >
        <img src={logoImage} alt="Maputnik" style={{width: 30, height: 30, paddingRight: 5, verticalAlign: 'middle'}}/>
        <span style={{fontSize: 20, verticalAlign: 'middle' }}>Maputnik</span>
      </ToolbarLink>
      <ToolbarAction onClick={this.toggleModal.bind(this, 'open')}>
        <OpenIcon />
        <IconText>Open</IconText>
      </ToolbarAction>
      {this.downloadButton()}
      <ToolbarAction onClick={this.toggleModal.bind(this, 'add')}>
        <AddIcon />
        <IconText>Add Layer</IconText>
      </ToolbarAction>
      <ToolbarAction onClick={this.toggleModal.bind(this, 'sources')}>
        <SourcesIcon />
        <IconText>Sources</IconText>
      </ToolbarAction>
      <ToolbarAction onClick={this.toggleModal.bind(this, 'settings')}>
        <SettingsIcon />
        <IconText>Style Settings</IconText>
      </ToolbarAction>
      <ToolbarAction onClick={this.toggleInspectionMode.bind(this)}>
        <InspectionIcon />
        <IconText>Inspect</IconText>
      </ToolbarAction>
      <ToolbarLink href={"https://github.com/maputnik/editor/wiki"}>
        <HelpIcon />
        <IconText>Help</IconText>
      </ToolbarLink>
    </div>
  }
}
