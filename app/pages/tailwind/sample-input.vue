<template>
  <input
    class="mt-4 rounded-md border border-blue-500 p-2 focus:border-2 focus:border-blue-700 focus:outline-none"
    placeholder="メールアドレスを変更してみてください"
    type="text"
  />
  <div>
    <label class="block text-sm/6 font-medium text-gray-900" for="price"
      >Price</label
    >
    <div class="mt-2">
      <div
        class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
      >
        <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
          $
        </div>
        <input
          id="price"
          class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          name="price"
          placeholder="0.00"
          type="text"
        />
        <div class="grid shrink-0 grid-cols-1 focus-within:relative">
          <select
            id="currency"
            aria-label="Currency"
            class="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            name="currency"
          >
            <option>USD</option>
            <option>CAD</option>
            <option>EUR</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>
