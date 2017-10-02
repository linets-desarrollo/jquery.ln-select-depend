;
(function ($) {
    $.fn.selectDepend = function () {
        return this.each(function (index, element) {
            var $element = $(element);

            $element.addClass('select-depend-active');

            $element.change(function () {
                var $dependent = $($element.data('dependent'));
                var $form = $element.closest('form');
                var $method = $form.find('[name="_method"]');
                var data = {};

                data[$element.attr('name')] = $element.val();

                $dependent.each(function (index, item) {
                    data[$(item).attr('name')] = $(item).val();
                });

                $element.prop("disabled", true);

                $.ajax({
                    url: $form.attr('action'),
                    type: $method.length ? $method.val() : $form.attr('method'),
                    data: data,
                    beforeSend: function () {
                        $dependent.each(function (index, item) {
                            $(item).html('<option value="">CARGANDO...</option>');
                        });
                    },
                    complete: function (jqXHR) {
                        $dependent.each(function (index, item) {
                            var $select = $(jqXHR.responseText).find('#' + $(item).attr('id'));
                            var cascade = $select.data('dependent-cascade');
                            var options = $select.html();

                            $(item).html(options);

                            if (undefined !== cascade) {
                                $(cascade)
                                    .not('.select-depend-active')
                                    .selectDepend();
                            }
                        });

                        $element.prop("disabled", false);
                    }
                });
            });

            $element.change();
        });
    };
}(jQuery));
