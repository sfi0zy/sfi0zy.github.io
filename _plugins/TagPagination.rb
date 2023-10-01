module Jekyll
    module Paginate
        module Tag
            class Pagination < Generator
                # safe true
                # priority :lowest

                def generate(site)
                    if Paginate::Pager.pagination_enabled?(site)
                        site.tags.each do |tag, posts|
                            number_of_pages = Paginate::Pager.calculate_pages(
                                posts,
                                site.config['paginate'].to_i
                            )

                            (0..number_of_pages).each do |i|
                                site.pages << TagIndexPage.new(site, tag, i)
                            end
                        end
                    end
                end
            end

            class TagIndexPage < Page
                def initialize(site, tag, page_index)
                    @site = site
                    @base = site.source
                    tag_dir = site.config['tags_dir']
                    @dir = File.join('tag', tag)
                    @name = Paginate::Pager.paginate_path(site, page_index)
                    @name.concat '/' unless @name.end_with? '/'
                    @name += 'index.html'

                    self.process(@name)
                    self.read_yaml(@base, 'index.html')

                    self.data.merge!(
                        'title' => 'Search: ' + tag,
                        'paginator' => Paginate::Pager.new(
                            site,
                            page_index,
                            site.tags[tag]
                        ),
                        'search' => true,
                        'search_tag' => tag
                    )
                end
            end
        end
    end
end

