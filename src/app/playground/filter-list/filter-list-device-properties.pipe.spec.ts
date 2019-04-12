import { FilterListDevicePropertiesPipe } from './filter-list-device-properties.pipe';

describe('DevicePropertiesPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterListDevicePropertiesPipe();
    expect(pipe).toBeTruthy();
  });
});
