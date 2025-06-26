import { Component, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import ErrorPage from '../pages/ErrorPage'

interface BoundaryState {
  hasError: boolean
}

class Boundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }
    return this.props.children
  }
}

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  const location = useLocation()
  return <Boundary key={location.pathname}>{children}</Boundary>
}
