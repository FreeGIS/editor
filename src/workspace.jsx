import React from 'react'
import { LayerList } from './layers/list.jsx'
import { SourceList } from './sources/list.jsx'
import { SettingsEditor } from './settings.jsx'
import { CodeEditor } from './codemode.jsx'
import { About } from './about.jsx'
import { colors, fullHeight } from './theme.js'

/** The workspace drawer contains the editor components depending on the edit
 * context chosen in the toolbar. It holds the state of the layers.*/
export class WorkspaceDrawer extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    workContext: React.PropTypes.oneOf(['layers', 'settings', 'sources', 'code']).isRequired,
    accessToken: React.PropTypes.string,
    onAccessTokenChanged: React.PropTypes.func,
    onReset: React.PropTypes.func,
  }

  onLayersChanged(changedLayers) {
    const changedStyle = this.props.mapStyle.set('layers', changedLayers)
    this.props.onStyleChanged(changedStyle)
  }

  onSourcesChanged(changedSources) {
    const changedStyle = this.props.mapStyle.set('sources', changedSources)
    this.props.onStyleChanged(changedStyle)
  }

  render() {
    let workspaceContent = null

    if(this.props.workContext === "sources") {
      workspaceContent = <SourceList
        onSourcesChanged={this.onSourcesChanged.bind(this)}
        sources={this.props.mapStyle.get('sources')}
      />
    }

    if(this.props.workContext === "code") {
      workspaceContent = <CodeEditor
        mapStyle={this.props.mapStyle}
        onStyleChanged={this.props.onStyleChanged}
      />
    }

    if(this.props.workContext === "layers") {
      workspaceContent = <LayerList
        onLayersChanged={this.onLayersChanged.bind(this)}
        layers={this.props.mapStyle.get('layers')}
      />
    }

    if(this.props.workContext === "settings") {
      workspaceContent = <SettingsEditor
        onReset={this.props.onReset}
        onStyleChanged={this.props.onStyleChanged}
        mapStyle={this.props.mapStyle}
        accessToken={this.props.accessToken}
        onAccessTokenChanged={this.props.onAccessTokenChanged}
      />
    }

    if(this.props.workContext === "about") {
      workspaceContent = <About />
    }

    return <div style={{
      ...fullHeight,
      top: 50,
      left: 0,
      zIndex: 100,
      width: 300,
      overflow: "hidden",
      backgroundColor: colors.gray
    }}>
      {workspaceContent}
    </div>
  }
}
