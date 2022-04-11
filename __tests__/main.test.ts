
import { test } from '@jest/globals'
import { run } from '../src/main'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  run();
})
