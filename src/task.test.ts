import test from 'ava';

import { CORRECT } from './correctResult';
import { INPUT } from './input';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';

const mockedData = async () => ({ data: INPUT });

test('categoryTree produces expected output', async (t) => {
  const output = await categoryTree(mockedData);
  t.deepEqual(output, CORRECT);
});

test('handles empty category data correctly', async (t) => {
  const getEmptyCategories = async (): ReturnType<typeof getCategories> => ({
    data: [],
  });

  const output = await categoryTree(getEmptyCategories);

  t.is(output.length, 0);
});

test('returns empty array for invalid data', async (t) => {
  const getInvalidCategories = async (): ReturnType<typeof getCategories> => ({
    data: undefined,
  });

  const output = await categoryTree(getInvalidCategories);

  t.is(output.length, 0);
});
