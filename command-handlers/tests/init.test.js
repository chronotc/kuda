describe('init', () => {
  context('when config file exist', () => {
    it('should attempt to reinitialize the repository');
  });

  context('when config file does not exist', () => {
    it('should initialize the repository');
  });

  describe('reinitialize', () => {
    it('should initialize the repository when the user chooses to');

    it('should do nothing if the user chooses not to reinitialize');
  });

  describe('initialize', () => {
    it('should prompt the user for a service to add');

    it('should add a service to kuda.json');

    it(`should update the service's package.json file`);

    it('should prompt the user for a location to persist remoteState');

    it('should write the remoteStatePath to kuda.json');
  });
});
